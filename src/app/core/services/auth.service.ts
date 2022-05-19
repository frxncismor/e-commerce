import { Injectable } from '@angular/core';
import {AuthChangeEvent, createClient, Session, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../../../environments/environment";
import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get user() {
    return this.supabase.auth.user();
  }

  get session() {
    return this.supabase.auth.session();
  }

  get profile() {
    return this.supabase
      .from('profiles')
      .select(`first_name, last_name, avatar_url, address`)
      .eq('id', this.user?.id)
      .single();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signIn({email});
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      id: this.user?.id,
      updated_at: new Date()
    }
    console.log(update)
    return this.supabase.from('profiles').upsert(update, {
      returning: 'minimal', // Don't return the value after inserting
    });
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage
      .from('avatars')
      .upload(filePath, file);
  }
}
