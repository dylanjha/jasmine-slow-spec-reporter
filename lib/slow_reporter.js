'use strict'

const chalk = require('chalk')
const blue = chalk.blue
const orange = chalk.keyword('orange')
const values = require('lodash/values')
const filter = require('lodash/filter')
const sortBy = require('lodash/sortBy')

class SlowReporter {
  constructor (config) {
    config = config || {}
    this._thresholdMs = config.thresholdMs || 100
    this._specRecords = {}
  }

  specStarted (result) {
    if (this._specRecords[result.id]) {
      throw new Error(
        'Error in JasmineSlowReporter, this spec id is not unique'
      )
    }
    this._specRecords[result.id] = {
      id: result.id,
      fullName: result.fullName,
      startTime: new Date(),
      status: result.status
    }
  }

  specDone (result) {
    if (!this._specRecords[result.id]) {
      throw new Error(
        "Error in JasmineSlowReporter, expected to have a record of when this spec started but can't find it"
      )
    }

    const record = this._specRecords[result.id]
    record.endTime = new Date()
    record.durationMs = record.endTime - record.startTime
  }

  getSlowRecords () {
    const records = values(this._specRecords)
    const filtered = filter(records, (record) => record.durationMs > this._thresholdMs)
    return sortBy(filtered, (record) => -record.durationMs)
  }

  jasmineDone () {
    const slowRecords = this.getSlowRecords()
    console.log(blue('Finished suite slow spec threshold:', this._thresholdMs, 'ms'))
    if (typeof console.group === 'function') {
      console.group()
    }
    slowRecords.forEach(slowRecord => {
      console.log(orange(`${slowRecord.durationMs}ms`, slowRecord.fullName))
    })
    if (typeof console.groupEnd === 'function') {
      console.groupEnd()
    }
  }
}

module.exports = SlowReporter
