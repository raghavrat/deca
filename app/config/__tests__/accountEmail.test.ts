import { isAccountEmailValid } from '../accountEmail'

describe('account email eligibility', () => {
  test('accepts valid email addresses without a private allowlist', () => {
    expect(isAccountEmailValid('student@example.com')).toBe(true)
    expect(isAccountEmailValid('member@westfordk12.us')).toBe(true)
  })

  test('rejects malformed addresses', () => {
    expect(isAccountEmailValid('not-an-email')).toBe(false)
    expect(isAccountEmailValid('missing-domain@')).toBe(false)
    expect(isAccountEmailValid('two words@example.com')).toBe(false)
  })
})
