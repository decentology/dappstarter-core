import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    // This should be modified to restrict users who can use Admin functionality
    // More info here: https://docs.nestjs.com/guards

    return true;
  }
}
