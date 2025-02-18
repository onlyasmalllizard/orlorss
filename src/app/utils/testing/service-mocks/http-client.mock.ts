import {of} from "rxjs";

export const httpClientMock = (response: Record<string, any>) => ({
  get: jest.fn().mockReturnValue(of(response))
});
