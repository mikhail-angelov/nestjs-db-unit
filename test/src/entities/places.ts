import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Point } from 'geojson';
import { ColumnEx } from '../../../dist';


@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ColumnEx({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  point!: Point;
}
