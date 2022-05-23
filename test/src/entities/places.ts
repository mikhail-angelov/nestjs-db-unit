import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Point } from 'geojson';


@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  point!: Point;
}
