import faker from 'faker'
import moment from 'moment'
import _ from 'lodash'
import { config } from 'components/js/config'
import { Report } from 'components/js/frame'
import { Response } from 'components/js/command'

// faker
const generateUnits = (total, excludes = []) => {
  let unitIDs = []
  // generate unique unitID
  while (unitIDs.length < total) {
    let unitID = faker.random.number()
    if (!_.some([...excludes, ...unitIDs], unitID)) {
      // push to array
      unitIDs.push(unitID)
    }
  }
  // generate
  return new Array(total).fill().map((el, i) => {
    return {
      unitID: unitIDs[i],
      client: {
        address: `::ffff:${faker.internet.ip()}`,
        port: faker.random.number(65535)
      }
    }
  })
}

const generateReports = (total, unitID) => {
  return new Array(total).fill().map((el, i) => {
    let frameID = _.sample([config.frame.id.SIMPLE, config.frame.id.FULL])
    let hexDataLength = frameID === config.frame.id.FULL ? 80 : 60

    return {
      unitID,
      frameID,
      hexData: faker.random.alphaNumeric(hexDataLength).toUpperCase(),
      data: Report.filter(el => {
        return (
          (frameID === config.frame.id.SIMPLE && el.required) ||
            frameID === config.frame.id.FULL
        )
      }).map((ele, j) => {
        let value

        switch (ele.field) {
          case 'prefix':
            value = '@G'
            break
          case 'crc':
            value = '0'
            break
          case 'size':
            value = faker.random.number(99)
            break
          case 'frameID':
            value = frameID
            break
          case 'unitID':
            value = unitID
            break
          case 'sequentialID':
            value = i
            break
          case 'rtcLogDatetime':
            value = moment().format('YYMMDDHHmmssE')
            break
          case 'driverID':
            value = faker.random.number(99999)
            break
          case 'eventsGroup':
            value = '0000000000000000'
            break
          case 'speed':
            value = faker.random.number(255)
            break
          case 'gpsLongitude':
            value = faker.random.number({
              min: config.map.borderIndonesia.lngMin,
              max: config.map.borderIndonesia.lngMax,
              precision: 0.000001
            })
            break
          case 'gpsLatitude':
            value = faker.random.number({
              min: config.map.borderIndonesia.latMin,
              max: config.map.borderIndonesia.latMax,
              precision: 0.000001
            })
            break
          case 'gpsHDOP':
            value = faker.random.number(30)
            break
          case 'gpsHeading':
            value = faker.random.number(259)
            break
          case 'odometer':
            value = faker.random.number(99999)
            break
          case 'batVoltage':
            value = faker.random.number(3300) / 13
            break
          case 'rangeApproximation':
            value = faker.random.number(999)
            break
          case 'batteryEfficiency':
            value = faker.random.number(99)
            break
          case 'tripA':
            value = faker.random.number(99999)
            break
          case 'tripB':
            value = faker.random.number(99999)
            break

          default:
            break
        }

        return {
          ...ele,
          value,
          output: ele.display(value)
        }
      })
    }
  })
}

const generateResponses = (total, unitID) => {
  return new Array(total).fill().map((el, i) => {
    let frameID = config.frame.id.RESPONSE
    let variable = faker.hacker.noun().replace(' ', '_').replace('-', '_').toUpperCase()
    let command = `${variable}=${faker.random.number(100)}`
    let message = `${_.sample(['OK', 'ERROR', 'INVALID'])}`

    return {
      unitID,
      hexData: faker.random.alphaNumeric(40).toUpperCase(),
      command,
      message,
      data: Response.map((ele, j) => {
        let value

        switch (ele.field) {
          case 'prefix':
            value = '@G'
            break
          case 'crc':
            value = '0'
            break
          case 'size':
            value = faker.random.number(99)
            break
          case 'frameID':
            value = frameID
            break
          case 'unitID':
            value = unitID
            break
          case 'message':
            value = message
            break

          default:
            break
        }

        return {
          ...ele,
          value,
          output: ele.display(value)
        }
      })
    }
  })
}

const generateFingers = (total, unitID) => {
  return new Array(total).fill().map((el, i) => {
    return {
      unitID,
      fingerID: i,
      name: faker.name.findName()
    }
  })
}

export {
  generateUnits,
  generateReports,
  generateResponses,
  generateFingers
}
