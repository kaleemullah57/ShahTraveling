import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  // get<T>(endpoint: string) {
  //   return this.http.get<T>(
  //     `${this.baseUrl}/${endpoint}`
  //   );
  // }

  get<T>(
  endpoint: string,
  params?: Record<string, string | number>
) {
  return this.http.get<T>(
    `${this.baseUrl}/${endpoint}`,
    { params }
  );
}

  post<T>(
    endpoint: string,
    body: unknown
  ) {
    return this.http.post<T>(
      `${this.baseUrl}/${endpoint}`,
      body
    );
  }

  put<T>(
    endpoint: string,
    body: unknown
  ) {
    return this.http.put<T>(
      `${this.baseUrl}/${endpoint}`,
      body
    );
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(
      `${this.baseUrl}/${endpoint}`
    );
  }
}