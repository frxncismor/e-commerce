import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/core/interfaces/profile';
import { AuthService } from "../../core/services/auth.service";
import { Session } from "@supabase/supabase-js";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loading = false;
  avatar_url;
  profile: Profile | undefined;

  @Input() session: Session | undefined;

  constructor(private readonly auth: AuthService) { }

  ngOnInit() {
    this.getProfile();
  }

  async getProfile() {
    try {
      this.loading = true;
      let {data: profile, error, status} = await this.auth.profile;

      if (error && status !== 406) {
        throw error;
      }

      if (profile) {
        this.profile = profile;
        console.log(this.profile)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(first_name: string, last_name: string, address: string, avatar_url: string) {
    try {
      this.loading = true;
      await this.auth.updateProfile({first_name, last_name, avatar_url, address});
    } catch (error) {
      alert(error.message);
    } finally {
      this.loading = false;
    }
  }

  async signOut() {
    await this.auth.signOut();
  }
}
