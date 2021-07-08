import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    //white spaces validation
    static notOnlyWhiteSpaces(control: FormControl) : ValidationErrors {

        //check if string only contains whitespaces
        if((control.value  != null) && (control.value.trim().length === 0 )){
            
            //invalid return object
            return {'notOnlyWhiteSpaces' : true};
        } else {
            //valid return null
            return null;
        }

    }

}
