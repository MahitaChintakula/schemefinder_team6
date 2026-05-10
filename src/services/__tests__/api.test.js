import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  signupUser,
  loginUser,
  getAllSchemes,
  matchSchemes,
  saveProfile,
} from '../api';

vi.mock('../../config/api', () => ({
  API_BASE_URL: 'https://mock-api.example.com',
  ENDPOINTS: {
    GET_SCHEMES: 'https://mock-api.example.com/get-schemes',
    MATCH_SCHEMES: 'https://mock-api.example.com/match-schemes',
    SAVE_PROFILE: 'https://mock-api.example.com/save-profile',
  },
}));

global.fetch = vi.fn();


describe('API Service', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  describe('signupUser', () => {

    test('calls correct signup URL', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          statusCode: 200,
          body: JSON.stringify({ message: 'Signup successful' }),
        }),
      });

      await signupUser({ fullName: 'John', email: 'john@test.com', password: 'Test123' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://mock-api.example.com/signup',
        expect.any(Object)
      );
    });

    test('sends POST method', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ statusCode: 200, body: JSON.stringify({}) }),
      });

      await signupUser({ fullName: 'John', email: 'john@test.com', password: 'Test123' });

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.method).toBe('POST');
    });

    test('sends correct Content-Type header', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ statusCode: 200, body: JSON.stringify({}) }),
      });

      await signupUser({ fullName: 'John', email: 'john@test.com', password: 'Test123' });

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers['Content-Type']).toBe('application/json');
    });

    test('sends user data as JSON string in body', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ statusCode: 200, body: JSON.stringify({}) }),
      });

      const userData = { fullName: 'John', email: 'john@test.com', password: 'Test123' };
      await signupUser(userData);

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.body).toBe(JSON.stringify(userData));
    });

    test('parses nested body string into object', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          statusCode: 200,
          body: JSON.stringify({ message: 'Signup successful', userId: '123' }),
        }),
      });

      const result = await signupUser({ fullName: 'John', email: 'john@test.com', password: 'Test123' });

      expect(result.body).toEqual({ message: 'Signup successful', userId: '123' });
    });

    test('returns data as-is when body is not a string', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          statusCode: 200,
          // No body field — should return without trying to parse
        }),
      });

      const result = await signupUser({ fullName: 'John', email: 'john@test.com', password: 'Test123' });

      expect(result.statusCode).toBe(200);
    });

    test('throws error when fetch rejects', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        signupUser({ fullName: 'John', email: 'john@test.com', password: 'Test123' })
      ).rejects.toThrow('Network error');
    });
  });


  describe('loginUser', () => {

    test('calls correct login URL', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          statusCode: 200,
          body: JSON.stringify({ message: 'Login successful', user: {} }),
        }),
      });

      await loginUser({ email: 'john@test.com', password: 'Test123' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://mock-api.example.com/login',
        expect.any(Object)
      );
    });

    test('sends POST method', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          statusCode: 200,
          body: JSON.stringify({}),
        }),
      });

      await loginUser({ email: 'john@test.com', password: 'Test123' });

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.method).toBe('POST');
    });

    test('sends correct Content-Type header', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ statusCode: 200, body: JSON.stringify({}) }),
      });

      await loginUser({ email: 'john@test.com', password: 'Test123' });

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers['Content-Type']).toBe('application/json');
    });

    test('sends credentials as JSON string in body', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ statusCode: 200, body: JSON.stringify({}) }),
      });

      const userData = { email: 'john@test.com', password: 'Test123' };
      await loginUser(userData);

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.body).toBe(JSON.stringify(userData));
    });

    test('parses nested body string into object', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          statusCode: 200,
          body: JSON.stringify({ message: 'Login successful', user: { email: 'john@test.com' } }),
        }),
      });

      const result = await loginUser({ email: 'john@test.com', password: 'Test123' });

      expect(result.body).toEqual({
        message: 'Login successful',
        user: { email: 'john@test.com' },
      });
    });

    test('returns statusCode 401 for wrong credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          statusCode: 401,
          body: JSON.stringify({ message: 'Invalid email or password' }),
        }),
      });

      const result = await loginUser({ email: 'wrong@test.com', password: 'wrong' });

      expect(result.statusCode).toBe(401);
      expect(result.body.message).toBe('Invalid email or password');
    });

    test('throws error when fetch rejects', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        loginUser({ email: 'john@test.com', password: 'Test123' })
      ).rejects.toThrow('Network error');
    });
  });


  describe('getAllSchemes', () => {

    test('calls correct GET_SCHEMES endpoint', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([{ scheme_name: 'Ayushman Bharat' }]),
      });

      await getAllSchemes();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://mock-api.example.com/get-schemes'
      );
    });

    test('returns schemes array on success', async () => {
      const mockSchemes = [
        { scheme_name: 'Ayushman Bharat' },
        { scheme_name: 'Jan Dhan Yojana' },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSchemes,
      });

      const result = await getAllSchemes();

      expect(result).toEqual(mockSchemes);
    });

    test('throws error when response is not ok', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false });

      await expect(getAllSchemes()).rejects.toThrow('Failed to fetch schemes');
    });

    test('throws error when fetch rejects', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getAllSchemes()).rejects.toThrow('Network error');
    });
  });


  describe('matchSchemes', () => {

    test('calls correct MATCH_SCHEMES endpoint', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ schemes: [] }),
      });

      await matchSchemes({ age: 25, income: 50000 });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://mock-api.example.com/match-schemes',
        expect.any(Object)
      );
    });

    test('sends POST method', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ schemes: [] }),
      });

      await matchSchemes({ age: 25, income: 50000 });

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.method).toBe('POST');
    });

    test('sends user data as JSON in body', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ schemes: [] }),
      });

      const userData = { age: 25, income: 50000, gender: 'female' };
      await matchSchemes(userData);

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.body).toBe(JSON.stringify(userData));
    });

    test('returns matched schemes on success', async () => {
      const mockResult = {
        schemes: [{ scheme_name: 'Ayushman Bharat' }],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const result = await matchSchemes({ age: 30 });

      expect(result).toEqual(mockResult);
    });

    test('throws error when response is not ok', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false });

      await expect(matchSchemes({ age: 25 })).rejects.toThrow(
        'Failed to match schemes'
      );
    });

    test('throws error when fetch rejects', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(matchSchemes({ age: 25 })).rejects.toThrow('Network error');
    });
  });


  describe('saveProfile', () => {

    test('calls correct SAVE_PROFILE endpoint', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Profile saved' }),
      });

      await saveProfile({ name: 'John', age: 25 });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://mock-api.example.com/save-profile',
        expect.any(Object)
      );
    });

    test('sends POST method', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Profile saved' }),
      });

      await saveProfile({ name: 'John', age: 25 });

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.method).toBe('POST');
    });

    test('sends profile data as JSON in body', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Profile saved' }),
      });

      const profileData = { name: 'John', age: 25, income: 30000 };
      await saveProfile(profileData);

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.body).toBe(JSON.stringify(profileData));
    });

    test('returns success response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Profile saved successfully' }),
      });

      const result = await saveProfile({ name: 'John' });

      expect(result.message).toBe('Profile saved successfully');
    });

    test('throws error when response is not ok', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false });

      await expect(saveProfile({ name: 'John' })).rejects.toThrow(
        'Failed to save profile'
      );
    });

    test('throws error when fetch rejects', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(saveProfile({ name: 'John' })).rejects.toThrow('Network error');
    });
  });

});
