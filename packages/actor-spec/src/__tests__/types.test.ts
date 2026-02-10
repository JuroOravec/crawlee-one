import { describe, it, expectTypeOf } from 'vitest';
import type {
  ActorSpec,
  ScraperActorSpec,
  ScraperDataset,
  DatasetOutput,
  DatasetFeatures,
  DatasetModes,
  DatasetPerfStat,
  DatasetFaultTolerance,
  DatasetFilterCompleteness,
} from '../index.js';

describe('Type exports', () => {
  it('ActorSpec has the expected shape', () => {
    expectTypeOf<ActorSpec>().toHaveProperty('actorspecVersion');
    expectTypeOf<ActorSpec>().toHaveProperty('actor');
    expectTypeOf<ActorSpec>().toHaveProperty('platform');
    expectTypeOf<ActorSpec>().toHaveProperty('authors');
    expectTypeOf<ActorSpec>().toHaveProperty('websites');
    expectTypeOf<ActorSpec>().toHaveProperty('pricing');
  });

  it('ScraperActorSpec extends ActorSpec with datasets', () => {
    expectTypeOf<ScraperActorSpec>().toMatchTypeOf<ActorSpec>();
    expectTypeOf<ScraperActorSpec>().toHaveProperty('datasets');
  });

  it('ScraperDataset has the expected shape', () => {
    expectTypeOf<ScraperDataset>().toHaveProperty('name');
    expectTypeOf<ScraperDataset>().toHaveProperty('shortDesc');
    expectTypeOf<ScraperDataset>().toHaveProperty('filters');
    expectTypeOf<ScraperDataset>().toHaveProperty('filterCompleteness');
    expectTypeOf<ScraperDataset>().toHaveProperty('modes');
    expectTypeOf<ScraperDataset>().toHaveProperty('features');
    expectTypeOf<ScraperDataset>().toHaveProperty('faultTolerance');
    expectTypeOf<ScraperDataset>().toHaveProperty('perfStats');
    expectTypeOf<ScraperDataset>().toHaveProperty('privacy');
    expectTypeOf<ScraperDataset>().toHaveProperty('output');
  });

  it('DatasetOutput generic defaults to Record<string, any>', () => {
    expectTypeOf<DatasetOutput>().toHaveProperty('exampleEntry');
    expectTypeOf<DatasetOutput>().toHaveProperty('exampleEntryComments');
  });

  it('DatasetOutput accepts custom entry type', () => {
    type CustomEntry = { id: number; name: string };
    type CustomOutput = DatasetOutput<CustomEntry>;
    expectTypeOf<CustomOutput['exampleEntry']>().toEqualTypeOf<CustomEntry>();
  });

  it('DatasetFeatures has boolean flags', () => {
    expectTypeOf<DatasetFeatures['limitResultsCount']>().toEqualTypeOf<boolean>();
    expectTypeOf<DatasetFeatures['usesBrowser']>().toEqualTypeOf<boolean>();
    expectTypeOf<DatasetFeatures['proxySupport']>().toEqualTypeOf<boolean>();
    expectTypeOf<DatasetFeatures['integratedETL']>().toEqualTypeOf<boolean>();
    expectTypeOf<DatasetFeatures['integratedCache']>().toEqualTypeOf<boolean>();
    expectTypeOf<DatasetFeatures['errorMonitoring']>().toEqualTypeOf<boolean>();
  });

  it('DatasetModes has the expected shape', () => {
    expectTypeOf<DatasetModes>().toHaveProperty('name');
    expectTypeOf<DatasetModes>().toHaveProperty('isDefault');
    expectTypeOf<DatasetModes>().toHaveProperty('shortDesc');
  });

  it('DatasetPerfStat has the expected shape', () => {
    expectTypeOf<DatasetPerfStat>().toHaveProperty('rowId');
    expectTypeOf<DatasetPerfStat>().toHaveProperty('colId');
    expectTypeOf<DatasetPerfStat>().toHaveProperty('costUsd');
    expectTypeOf<DatasetPerfStat>().toHaveProperty('timeSec');
    expectTypeOf<DatasetPerfStat>().toHaveProperty('mode');
    expectTypeOf<DatasetPerfStat['count']>().toEqualTypeOf<number | 'all'>();
  });

  it('DatasetFaultTolerance has the expected shape', () => {
    expectTypeOf<DatasetFaultTolerance['dataLossScope']>().toEqualTypeOf<
      'all' | 'batch' | 'entry' | 'fields'
    >();
    expectTypeOf<DatasetFaultTolerance>().toHaveProperty('timeLostAvgSec');
    expectTypeOf<DatasetFaultTolerance>().toHaveProperty('timeLostMaxSec');
  });

  it('DatasetFilterCompleteness is a union of string literals', () => {
    expectTypeOf<DatasetFilterCompleteness>().toEqualTypeOf<'none' | 'some' | 'full' | 'extra'>();
  });
});
