'use strict'

const SlowReporter = require('./slow_reporter')

describe('SlowReporter', () => {
  describe('constructor', () => {
    it('should initialize with the configured threshold', () => {
      const slowReporter = new SlowReporter({ thresholdMs: 200 })
      expect(slowReporter._thresholdMs).toEqual(200)
    })
  })

  describe('suiteLifeCycle', () => {
    let slowReporter
    let test1
    let test2
    let test3

    beforeAll(() => {
      slowReporter = new SlowReporter()
      test1 = {id: '1', description: 'test 1', fullName: 'name test 1'}
      test2 = {id: '2', description: 'test 2', fullName: 'name test 2'}
      test3 = {id: '3', description: 'test 3', fullName: 'name test 3'}
    })

    describe('specStarted', () => {
      let records

      beforeAll(() => {
        slowReporter.specStarted(test1)
        slowReporter.specStarted(test2)
        slowReporter.specStarted(test3)
        records = slowReporter._specRecords
      })

      it('should save a record for each spec', () => {
        expect(Object.keys(records)).toEqual(['1', '2', '3'])
      })

      it('should save the start times', () => {
        expect(records['1'].startTime).toEqual(jasmine.any(Date))
        expect(records['2'].startTime).toEqual(jasmine.any(Date))
        expect(records['3'].startTime).toEqual(jasmine.any(Date))
      })
    })

    describe('specDone', () => {
      let records

      beforeAll(() => {
        slowReporter.specDone(test1)
        slowReporter.specDone(test2)
        slowReporter.specDone(test3)
        records = slowReporter._specRecords
      })

      it('should save the end times', () => {
        expect(records['1'].endTime).toEqual(jasmine.any(Date))
        expect(records['2'].endTime).toEqual(jasmine.any(Date))
        expect(records['3'].endTime).toEqual(jasmine.any(Date))
      })

      it('should save durations', () => {
        expect(records['1'].durationMs).toEqual(jasmine.any(Number))
        expect(records['2'].durationMs).toEqual(jasmine.any(Number))
        expect(records['3'].durationMs).toEqual(jasmine.any(Number))
      })
    })

    describe('getSlowRecords', () => {
      beforeAll(() => {
        const records = slowReporter._specRecords
        records['1'].durationMs = 200
        records['2'].durationMs = 99
        records['3'].durationMs = 150
      })

      it('should get the slow records and not the fast ones', () => {
        const slowRecords = slowReporter.getSlowRecords()
        expect(slowRecords.length).toEqual(2)
        expect(slowRecords.map((record) => record.id)).toEqual(['1', '3'])
      })
    })

    describe('jasmineDone', () => {
      it('should get the slow records and not the fast ones', () => {
        expect(slowReporter.jasmineDone.bind(slowReporter)).not.toThrow()
      })
    })
  })
})
