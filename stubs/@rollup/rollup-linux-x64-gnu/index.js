const acorn = require('acorn')
const crypto = require('node:crypto')

function withParserOptions(options = {}) {
  const {
    ecmaVersion = 'latest',
    sourceType = 'module',
    allowHashBang = true,
    locations = true,
    ranges = true,
    ...rest
  } = options
  return { ecmaVersion, sourceType, allowHashBang, locations, ranges, ...rest }
}

function parse(code, options) {
  return acorn.parse(code, withParserOptions(options))
}

async function parseAsync(code, options) {
  return parse(code, options)
}

function createHash(input) {
  return crypto.createHash('sha256').update(input)
}

function xxhashBase64Url(input) {
  return createHash(input).digest('base64url')
}

function xxhashBase36(input) {
  return BigInt('0x' + createHash(input).digest('hex')).toString(36)
}

function xxhashBase16(input) {
  return createHash(input).digest('hex')
}

module.exports = {
  parse,
  parseAsync,
  xxhashBase64Url,
  xxhashBase36,
  xxhashBase16,
}
