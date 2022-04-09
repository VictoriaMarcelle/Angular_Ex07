import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GithubService } from './services/github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form!: FormGroup;
  columns: string[] = ['name', 'language', 'stargazers_count', 'full_name'];
  loaded = false;
  loading = false;

  userInfo = {
    avatar_url: '',
    name: '',
    login: '',
    bio: '',
    blog: '',
    html_url: '',
    location: '',
    followers: 0,
    following: 0,
    repositorios: []
  };

  constructor(
    private githubService: GithubService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]]
    });
  }

  search() {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      this.loading = true;

      this.githubService.findByUsername(formData.username).subscribe({
        next: (info: any) => {
          this.userInfo = {
            avatar_url: info.avatar_url,
            name: info.name,
            login: info.login,
            bio: info.bio,
            blog: info.blog,
            html_url: info.html_url,
            location: info.location,
            followers: info.followers,
            following: info.following,
            repositorios: []
          };

          this.githubService.findByUsernameRepo(formData.username).subscribe({
            next: (repos: any) => {
              const newRepos: any = [];
              repos.map((repo: any) => {
                newRepos.push({
                  name: repo.name,
                  language: repo.language,
                  stargazers_count: repo.stargazers_count,
                  full_name: repo.full_name,
                  html_url: repo.html_url
                });
              });
              this.userInfo.repositorios = newRepos;
            },
            complete: () => {
              this.loaded = true;
              this.loading = false;
            }
          })
        },
        error: (e) => {
          alert('Usuário não encontrado');
          this.loaded = false;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  resetSeach() {
    this.loaded = false;
  }
}
