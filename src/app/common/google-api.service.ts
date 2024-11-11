import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { Recipe } from '../cookbook/recipe.dto';
// const {google} = require('googleapis');

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  readonly apiKey: string = '';
  readonly spreadsheetId: string = '';
  readonly getSheetUrl: string = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}?includeGridData=true`;
  readonly updateSheetUrl: string = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}:batchUpdate`;
  constructor() {
    axios.defaults.headers.common['X-goog-api-key'] = this.apiKey;
  }

  startOauth() {
    // const credentials = JSON.parse(googleAuth);
    // console.log(credentials)
    // const cc = google.auth.fromJSON(credentials);
    // console.log(cc)
    // const client = new OAuth2Client(clientId, clientSecret, undefined);
    // client.getAccessToken().then((resp: any) => console.log(resp))
  }
  addRecipe(body: Recipe) {
  }

  getRecipes() {
    const sampleRecipe: Recipe = {
      title: 'sample'
    };
    const postRecipe = {
      spreadsheetId: this.spreadsheetId
    };
    console.log(this.getSheetUrl, axios.defaults.headers)
    axios.post(this.updateSheetUrl, postRecipe)
      .then(resp => console.log(resp))
      .catch(err => console.log(err));
    // axios.get(this.getSheetUrl)
    //   .then(resp => {
    //     console.log(resp)
    //     const spreadsheet = resp.data.sheets[0];
    //     if (spreadsheet.data) {
    //       const rowData = spreadsheet.data[0].rowData;
    //       const headers = rowData[0].values.map((d: any) => d.effectiveValue.stringValue);
    //       console.log(headers)
    //     }
    //   })
    //   .catch(err => console.log(err));
  }
}
