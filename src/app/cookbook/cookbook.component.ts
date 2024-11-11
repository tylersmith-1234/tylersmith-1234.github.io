import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CookbookError } from './cookbook-error.dto';
import { TooltipPosition } from '../common/tooltip/tooltip/tooltip.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { GoogleApiService } from '../common/google-api.service';
import { Recipe } from './recipe.dto';
declare var html2pdf: any;

@Component({
  selector: 'app-cookbook',
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.scss']
})
export class CookbookComponent {

  readonly tooltipPosition = TooltipPosition;
  readonly recipeTypes: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Miscellaneous'];
  readonly measurementTypes: string[] = ['Cup', 'Tablespoon', 'Teaspoon', 'Gallon'];
  readonly curDate: Date = new Date();
  curYear: number = this.curDate.getFullYear();
  submitClicked: boolean = false;
  pdfSrc: SafeResourceUrl;
  errorsExist: boolean = false;
  errors: {
    title: CookbookError[];
    titleTooltip: string;
    username: CookbookError[];
    usernameTooltip: string;
    recipeType: CookbookError[];
    recipeYear: CookbookError[];
    recipeTooltip: string;
    ingredients: CookbookError[];
    ingredientsTooltip: string[][];
    instructions: CookbookError[];
    instructionsTooltip: string;
    picture: CookbookError[];
    pictureYear: CookbookError[];
    pictureTooltip: string;
    caption: CookbookError[];
    captionTooltip: string;
  };
  recipeForm = this.fb.group({
    title: new FormControl('', Validators.required),
    submittedBy: new FormControl('', Validators.required),
    recipeType: new FormControl(''),
    year: new FormControl(''),
    ingredients: this.fb.array<FormGroup>([], Validators.required),
    instructions: new FormControl('', Validators.required),
    pic: new FormControl(),
    picMonth: new FormControl(''),
    picYear: new FormControl(''),
    picCaption: new FormControl('')
  });
  recipeImageUrl: string | undefined;
  readonly maxImageHeight: number = 600;
  readonly maxImageWidth: number = 900;
  imageHeight: number;
  imageWidth: number;
  monthList: any[] = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder,
    private googleApiService: GoogleApiService) {
    this.recipeForm.controls['recipeType'].setValue('Miscellaneous', {onlySelf: true});
    this.onPreviewClick = this.onPreviewClick.bind(this);
    this.resetErrors();
    this.googleApiService.startOauth();
    // this.googleApiService.getRecipes();
  }

  gapiLoaded() {
    // gapi.load('client', initializeGapiClient);

  }
  gisLoaded() {}
  private async fillRecipePdf() {
    const options = {
      margin: 20,
      filename: 'output.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1, useCors: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };
    
    const formData = this.recipeForm.value;
    const ingr: any[] = [
      [.5, 'unit', 'nutmeg'],
      [1, 'unit', 'cinnamon stick'],
      [1, 'tbsp', 'coriander seeds'],
      [1, 'tsp', 'whole cloves'],
      [6, 'unit', 'allspice berries'],
      [1, 'unit', 'whole chicken cut into 8 pieces (or 8+ breasts)']
    ];
    const instructions: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const recipeHtml: string = `
      <div class="body">
        <div class="header">
          <div>
            <span>${new Date().getFullYear()}</span>
            <span class="${formData.recipeType?.length ? '' : 'missing'}">
              ${formData.recipeType}
            </span>
          </div>
          <span class="${formData.submittedBy?.length ? '' : 'missing'}">
            ${formData.submittedBy || '[NAME REQUIRED]'}
          </span>
        </div>
        <div class="title ${formData.title?.length ? '' : 'missing'}">
          ${formData.title || '[TITLE REQUIRED]'}
        </div>
        <ul class="ingredients ${formData.ingredients?.length ? '' : 'missing'}">
          ${ingr.map(i => `<li>${i[0]} ${i[1]} ${i[2]}</li>`).join('\n')}
        </ul>
        <span class="instructions ${formData.instructions?.length ? '' : 'missing'}">
          ${instructions || formData.instructions}
        </span>
        ${this.recipeImageUrl ? `<div class="image-content">
          <br>
          <img src="${this.recipeImageUrl}"
            height="${this.imageHeight || 0}" width="${this.imageWidth || 0}">
          <br>
          <div class="image-caption">
            <span>${formData.picMonth} ${formData.picYear}</span>
            <br>
            <span>${formData.picCaption}</span>
          </div>
        </div>` : ''}
      </div>
      <style type='text/css'>
        .body {
          font-family: Arial;
          color: black;
          font-size: 20px;
          width: calc(100% - 7px);
          .header {
            display: flex;
            justify-content: space-between;
          }
          .title {
            width: 100%;
            text-align: center;
            font-size: 35px;
            font-weight: bold;
            margin: 30px 0;
          }
          .ingredients {
            list-style: none;
            columns: 2;
            -webkit-columns: 2;
            -moz-columns: 2;
            &.missing::before {
              content: 'You forgot your ingredients!';
            }
          }
          .missing {
            color: red;
          }
          .image-content {
            break-inside: avoid;
            align-items: center;
            text-align: center;
          }
        }
      </style>
    `;
    const str = await html2pdf().from(recipeHtml).set(options)
      .toPdf().output('datauristring');
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(str);
  }

  addIngredient() {
    const ingredientForm = this.fb.group({
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern(/((\d*\.\d+)|((?:\d+ )\d+\/\d+)|(\d+))/)
      ]),
      units: new FormControl('', [Validators.required]),
      item: new FormControl('', [Validators.required])
    });
  
    this.recipeForm.controls['ingredients'].push(ingredientForm);
  }
  onTitleChange() {
    this.getFormValidationErrors('title')
  }
  onUserChange() {
    this.getFormValidationErrors('submittedBy');
    console.log(this.errors.username)
  }
  onRecipeTypeChange(thing: any) {
    console.log(thing)
  }
  onAmountChange(thing: any) {
    console.log(thing);
    this.getFormValidationErrors('ingredients')
  }
  onUnitChange(thing: any) {
    console.log(thing)
    this.getFormValidationErrors('ingredients')
  }
  onItemChange(thing: any) {
    console.log(thing);
    this.getFormValidationErrors('ingredients')
  }
  onImageUpload(thing: any) {
    const recipeImage = thing.target.files[0];
    if (recipeImage) {
      const picYear: number = new Date(recipeImage.lastModified)?.getFullYear();
      this.curYear = picYear || this.curDate.getFullYear();
      this.recipeForm.controls.picYear.setValue(this.curYear.toString());
      const reader = new FileReader();
      reader.readAsDataURL(recipeImage); 
      reader.onload = (_event) => {
          const img = new Image();
          this.recipeImageUrl = reader.result?.toString();
          img.src = this.recipeImageUrl || '';
          img.onload = () => {
            this.calculateImageDimensions(img.height, img.width);
          }
      }
    }
  }

  onImageCancel(event: any) {
    console.log(event)
  }

  private calculateImageDimensions(initHeight: number, initWidth: number): void {
    if (initHeight > this.maxImageHeight) {
      const ratio = this.maxImageHeight/initHeight;
      initHeight = this.maxImageHeight;
      initWidth = Math.floor(initWidth * ratio);
    }
    if (initWidth > this.maxImageWidth) {
      const ratio = this.maxImageWidth/initWidth;
      initWidth = this.maxImageWidth;
      initHeight = Math.floor(initHeight * ratio);
    }
    this.imageHeight = initHeight;
    this.imageWidth = initWidth;
  }

  onSubmit() {
    this.submitClicked = true;
    const errs = this.getFormValidationErrors();
    if (!errs?.length) {
      const data = this.recipeForm.value;
      const recipeToAdd: Recipe = {
        title: data.title?.toString(),
        submittedBy: data.submittedBy?.toString(),
        recipeType: data.recipeType?.toString(),
        year: parseInt(data.year || this.curYear.toString()),
        ingredients: data.ingredients?.map(ingr => ({
          amount: ingr[0],
          units: ingr[1],
          item: ingr[2]
        })) || [],
        instructions: data.instructions?.toString(),
        pic: data.pic,
        picMonth: data.picMonth?.toString(),
        picYear: parseInt(data.picYear || this.curYear.toString()),
        picCaption: data.picCaption?.toString()
      };
      this.googleApiService.addRecipe(recipeToAdd);
    }
  }

  onPreviewClick() {
    this.fillRecipePdf();
  }



  ngOnInit(): void {
  }

  get ingredients(): FormArray {
    return this.recipeForm.controls['ingredients'] as FormArray<FormGroup>;
  }
  removeIngredient(i: number) {
    this.recipeForm.controls['ingredients'].removeAt(i);
  }
  checkForErrors(): boolean {
    this.errorsExist = !!this.errors.title.length ||
      !!this.errors.username.length ||
      !!this.errors.recipeType.length ||
      !!this.errors.ingredients.length ||
      !this.ingredients.controls.length || // dont submit with zero ingredients.
      !!this.errors.instructions.length ||
      !!this.errors.picture.length ||
      !!this.errors.caption.length ||
      !!this.errors.pictureYear.length ||
      !!this.errors.recipeYear.length;
    return this.errorsExist;
  }
  resetErrors() {
    this.errors = {
      title: [],
      titleTooltip: '',
      username: [],
      usernameTooltip: '',
      recipeType: [],
      recipeTooltip: '',
      ingredients: [],
      ingredientsTooltip: [],
      instructions: [],
      instructionsTooltip: '',
      picture: [],
      pictureTooltip: '',
      caption: [],
      captionTooltip: '',
      pictureYear: [],
      recipeYear: []
    };
    this.checkForErrors();
  }
  private getErrorObjectKey(key?: string) {
    switch (key?.toLowerCase()) {
      case 'title':
        return 'title';
      case 'submittedby':
        return 'username';
      case 'recipetype':
        return 'recipeType';
      case 'year':
        return 'recipeYear';
      case 'ingredients':
        return 'ingredients';
      case 'instructions':
        return 'instructions';
      case 'pic':
        return 'picture';
      case 'picyear':
        return 'pictureYear';
      case 'piccaption':
        return 'caption';
      default:
        return 'title';
    }
  }
  getFormValidationErrors(onlyKey?: string): string[] {
    const errs: string[] = [];
    this.recipeForm.markAllAsTouched()
    // console.log(this.recipeForm.controls.ingredients)
    this.resetErrors();
    if (onlyKey && onlyKey === 'ingredients') {
      this.recipeForm.controls.ingredients.controls.forEach((ctrl, i) => {
        Object.keys(ctrl.controls).forEach(key => {
          const controlErrors: ValidationErrors | null | undefined = ctrl.controls[key]?.errors;
          if (controlErrors != null && controlErrors != undefined) {
            Object.keys(controlErrors).forEach(keyError => {
              this.errors['ingredients'].push({
                message: keyError,
                component: 'ingredients',
                componentIndex: i,
                innerComponent: key
              })
              errs.push('Key control: ' + key + i + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
          }
        });
      });
    }
    Object.keys(this.recipeForm.controls)
      .filter(key => !onlyKey || key.toLowerCase() === onlyKey.toLowerCase()).forEach(key => {
      const controlErrors: ValidationErrors | null | undefined = this.recipeForm.get(key)?.errors;
      const errorKey = this.getErrorObjectKey(key);
      if (controlErrors != null && controlErrors != undefined) {
        this.errorsExist = true;
        Object.keys(controlErrors).forEach(keyError => {
          this.errors[errorKey].push({
            message: keyError,
            component: errorKey
          });
         errs.push('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
    this.errors.titleTooltip = this.errors.title.map(err => err.message).join(';');
    this.errors.usernameTooltip = this.errors.username.map(err => err.message).join(';');
    this.errors.recipeTooltip = (this.errors.recipeType.concat(this.errors.recipeYear)).map(err => err.message).join(';');
    this.errors.instructionsTooltip = this.errors.instructions.map(err => err.message).join(';');
    this.errors.pictureTooltip = (this.errors.picture.concat(this.errors.pictureYear)).map(err => err.message).join(';');
    this.errors.captionTooltip = this.errors.caption.map(err => err.message).join(';');
    this.errors.ingredientsTooltip = this.parseControlArrayErrs(this.recipeForm.controls.ingredients.controls)
    this.checkForErrors();
    return errs;
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  parseControlArrayErrs(controls: FormGroup<any>[]) {
    const tooltip: string[][] = [];
    controls.forEach(element => {
      const innerControls = element.controls;
      const curTooltip: string[] = [];
      Object.keys(innerControls).forEach(innerKey => {
        console.log(innerKey, innerControls[innerKey])
        if (innerControls[innerKey].errors !== null) {
          console.log(innerControls[innerKey].errors)
          const errs = Object.keys(innerControls[innerKey].errors as ValidationErrors).join(';');
          curTooltip.push(`${innerKey}: ${errs}`)
        }
      });
      tooltip.push(curTooltip)
    });
    return tooltip;
  }
  
}
