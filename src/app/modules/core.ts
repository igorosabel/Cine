import { Provider } from '@angular/core';
import ApiService from '@services/api-service';
import AuthService from '@services/auth-service';
import ClassMapperService from '@services/class-mapper-service';
import MoviesService from '@services/movies-service';
import NavigationService from '@services/navigation-service';
import UserService from '@services/user-service';

function provideCore(): Provider[] {
  return [
    ApiService,
    AuthService,
    ClassMapperService,
    MoviesService,
    NavigationService,
    UserService,
  ];
}
export default provideCore;
