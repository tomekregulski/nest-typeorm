import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    // set up the association
    // on save() just the user id will be extracted and saved on the report entry
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate({
    make,
    model,
    lng,
    lat,
    mileage,
    year,
  }: GetEstimateDto) {
    return (
      this.repo
        // Return a single row, showing an average of the top three records that match this criteria
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        // can't just chain "where" functions - need to use "andWhere" for multiple conditions
        .andWhere('model = :model', { model })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        // .andWhere('approved IS TRUE')
        // ABS allows orderBy to take into account both greater thana nd less than entries
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        // orderBy does not take second argument, so we use setParameters
        .setParameters({ mileage })
        .limit(3)
        .getRawMany()
    );
  }
}
