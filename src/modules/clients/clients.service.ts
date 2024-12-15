import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from '@/entities/clients/clients.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async find(
    where?: Partial<Client>,
    relations: string[] = [],
  ): Promise<Client[]> {
    return this.clientsRepository.find({ where, relations });
  }

  async findOne(
    where: Partial<Client>,
    relations: string[] = [],
  ): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where, relations });
    return client;
  }

  async insert(data: Partial<Client>): Promise<Client> {
    const existingClient = await this.clientsRepository.findOne({
      where: { email: data.email },
    });

    if (existingClient) {
      throw new Error('Client already exists');
    }

    const client = this.clientsRepository.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.clientsRepository.save(client);
  }

  async update(id: string, data: Partial<Client>): Promise<void> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');

    await this.clientsRepository.update(id, { ...data, updatedAt: new Date() });
  }

  async delete(id: string): Promise<void> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');

    await this.clientsRepository.delete(id);
  }
}
