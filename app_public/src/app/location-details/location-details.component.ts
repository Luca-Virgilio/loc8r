import { Component, OnInit, Input } from '@angular/core';
import { Location, Review } from '../location';
import { Loc8rDataService } from '../loc8r-data.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {
  @Input() location: Location;


  //each property needs a default value
  public newReview: Review = {
    author: '',
    rating: 5,
    reviewText: ''
  };
  // variables to hide review form
  public formVisible: boolean = false;

  //public googleAPIKey: string = '<Put your Google Maps API Key here>';

  constructor(private loc8rDataService: Loc8rDataService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  public formError: string;

  // verify the form's validity
  private formIsValid(): boolean {
    //console.log(this.newReview);
    this.newReview.author = this.getUsername();
    if (this.newReview.author && this.newReview.rating && this.newReview.reviewText) {
      return true;
    } else {
      return false;
    }
  }
  // sent review to API
  public onReviewSubmit(): void {
    this.formError = '';
    if (this.formIsValid()) {
      console.log(this.newReview);
      this.loc8rDataService.addReviewByLocationId(this.location._id, this.newReview)
        .then((review: Review) => {
          console.log('Review saved', review);
          // update reviews and recall rest form
          let reviews = this.location.reviews.slice(0);
          reviews.unshift(review);
          this.location.reviews = reviews;
          this.resetAndHideReviewForm();
        });
    } else {
      this.formError = 'All fields required, please try again';
    }
  }
  // reset form 
  private resetAndHideReviewForm(): void {
    console.log('resetta');
    this.formVisible = false;
    //this.newReview.author = '';
    this.newReview.rating = 5;
    this.newReview.reviewText = '';
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
  public getUsername(): string {
    const { name } = this.authenticationService.getCurrentUser();
    return name ? name : 'Guest';
  }
}
