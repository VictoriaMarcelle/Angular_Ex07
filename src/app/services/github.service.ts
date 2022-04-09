import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'https://api.github.com/users';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private httpClient: HttpClient) { }

  findByUsername(username: String) {
    return this.httpClient.get(`${API}/${username}`);
  }

  findByUsernameRepo(username: String) {
    return this.httpClient.get(`${API}/${username}/repos`);
  }
}
