//  export class Main_Category {
//     id:number=0;
//     MainCategoryName:string='';
//     Main_Description:string='';
//    }

export class Main_Category {
  id: number = 0;
  MainCategoryName: string = '';
  Main_Description: string = '';
  subCategories?: Sub_Category[];  // ✅ Add this optional property
}

 

  export class Sub_Category {
    id:number=0;
    MainCategoryName: string = '';
    SubCategoryName: string = '';
    CategoryTypeName:string='';
    Sub_Description: string = '';
    Tags: string = '';
    Images: string = ''; 
  }