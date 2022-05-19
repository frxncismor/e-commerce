import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  _avatarUrl: SafeResourceUrl | undefined;
  uploading = false;

  @Input()
  set avatarUrl(url: string | undefined) {
    if (url) {
      this.downloadImage(url);
    }
  };

  @Output() upload = new EventEmitter<string>();

  constructor(
    private readonly auth: AuthService,
    private readonly dom: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  async downloadImage(path: string) {
    try {
      const {data} = await this.auth.downLoadImage(path);
      this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data));
    } catch (error) {
      console.error('Error downloading image: ', error.message);
    }
  }

  async uploadAvatar(event: any) {
    try {
      this.uploading = true;
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      await this.auth.uploadAvatar(filePath, file);
      this.upload.emit(filePath);
      this.downloadImage(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      this.uploading = false;
    }
  }

}
