import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationsService } from '../../Service/destinations.service';
import { Destination } from '../../Model/destination.module';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-view-destination',
  templateUrl: './view-destination.component.html',
  styleUrls: ['./view-destination.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ViewDestinationComponent implements OnInit {
  destination: Destination | undefined;

  constructor(
    private route: ActivatedRoute,
    private destinationsService: DestinationsService
  ) {}

  async ngOnInit(): Promise<void> {
    const destinationCode = this.route.snapshot.paramMap.get('code');
    if (destinationCode) {
      this.destination = await this.destinationsService.get(destinationCode);
    }
  }
}
