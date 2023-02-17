import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: string;

  // obj is a reference to the original report entity
  // we pull that in, grab the user property, pull out the id, and assign it to userId
  // this way, we are not sending the entire user object in the report response
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
