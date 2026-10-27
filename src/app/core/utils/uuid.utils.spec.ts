import { assertUuid, getOrCreateGuestSessionId } from './uuid.utils';

describe('assertUuid', () => {
  it("should return null for literal string 'undefined'", () => {
    expect(assertUuid('undefined')).toBeNull();
    expect(assertUuid('UNDEFINED')).toBeNull();
  });

  it('should return null for null and undefined', () => {
    expect(assertUuid(null)).toBeNull();
    expect(assertUuid(undefined)).toBeNull();
  });

  it('should return null for empty string or whitespace', () => {
    expect(assertUuid('')).toBeNull();
    expect(assertUuid('   ')).toBeNull();
  });

  it("should return null for literal string 'null'", () => {
    expect(assertUuid('null')).toBeNull();
    expect(assertUuid('NULL')).toBeNull();
  });

  it('should return null for invalid non-UUID strings', () => {
    expect(assertUuid('not-a-uuid')).toBeNull();
    expect(assertUuid('12345')).toBeNull();
    expect(assertUuid('550e8400-e29b-41d4-a716-44665544000')).toBeNull(); // 1 char short
    expect(assertUuid('550e8400-e29b-41d4-a716-446655440000z')).toBeNull(); // invalid char
  });

  it('should return normalized lowercase UUID for valid canonical UUID', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    expect(assertUuid(validUuid)).toBe(validUuid);

    const uppercaseUuid = 'BBA26CCD-59CE-471C-AAC0-4C1F5513DE3B';
    expect(assertUuid(uppercaseUuid)).toBe('bba26ccd-59ce-471c-aac0-4c1f5513de3b');
  });
});

describe('getOrCreateGuestSessionId', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should generate and persist a valid UUID in guest_session_id', () => {
    const id = getOrCreateGuestSessionId();
    expect(assertUuid(id)).not.toBeNull();
    expect(localStorage.getItem('guest_session_id')).toBe(id);
    expect(localStorage.getItem('cart_session_id')).toBe(id);
  });

  it('should reuse an existing valid UUID in localStorage', () => {
    const existing = '550e8400-e29b-41d4-a716-446655440000';
    localStorage.setItem('guest_session_id', existing);

    const id = getOrCreateGuestSessionId();
    expect(id).toBe(existing);
  });

  it("should replace corrupted 'undefined' in localStorage with a fresh UUID", () => {
    localStorage.setItem('guest_session_id', 'undefined');

    const id = getOrCreateGuestSessionId();
    expect(id).not.toBe('undefined');
    expect(assertUuid(id)).not.toBeNull();
  });
});
