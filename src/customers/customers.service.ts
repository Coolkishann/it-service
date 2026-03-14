// src/customers/customers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto, QueryCustomerDto } from './dto/customers.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: createCustomerDto,
      include: {
        office: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(filter: any, query: QueryCustomerDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { ...filter };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await this.prisma.customer.count({ where });

    // Get paginated data
    const customers = await this.prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        office: {
          select: {
            id: true,
            name: true,
          },
        },
        branches: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            branches: true,
          },
        },
      },
    });

    return {
      data: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        office: true,
        branches: {
          include: {
            devices: {
              select: {
                id: true,
                category: true,
                company: true,
                model: true,
                serialNumber: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    // Check if customer exists
    await this.findOne(id);

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        office: true,
      },
    });
  }

  async remove(id: number) {
    // Check if customer exists
    await this.findOne(id);

    // Check if customer has branches
    const branches = await this.prisma.branch.count({
      where: { customerId: id },
    });

    if (branches > 0) {
      throw new Error('Cannot delete customer with existing branches');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async getStats(officeFilter: any) {
    const where = officeFilter;

    const [totalCustomers, activeCustomers, totalRevenue] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.count({
        where: {
          ...where,
          branches: {
            some: {
              devices: {
                some: {},
              },
            },
          },
        },
      }),
      // This would come from invoices/payments table if you have one
      Promise.resolve(0),
    ]);

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
    };
  }
}
