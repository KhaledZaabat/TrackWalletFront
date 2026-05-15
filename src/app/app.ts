import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterContainerComponent } from './shared/toast/toaster-container.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ToastService } from './shared/toast';
import { ConfirmDialogService } from './shared/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterContainerComponent, ConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone:true
})
export class App {
  

public toasterService=inject(ToastService);
  private dialog = inject(ConfirmDialogService);

public  async showSuccess(){
  const confirmed = await this.dialog.confirm({
      title: 'Delete wallet?',
      description: 'This will permanently remove the wallet and all its transactions.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'destructive',
    });

    if (confirmed) {
      this.toasterService.success("Succeded");
    }
}

}
