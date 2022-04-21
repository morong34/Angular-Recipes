import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(storeData => {
        if (storeData.editedIngredientIndex > -1) {
           this.editMode = true;
           this.editedItem = storeData.editedIngredient;
           this.slForm.setValue({
               name: this.editedItem.name,
               amount: this.editedItem.amount
           });
        } else {
            this.editMode = false;
        }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);
    if  (this.editMode){
        this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    } else {
        this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }
    this.editMode = false
    form.reset()
  }

  onClear() {
      this.slForm.reset();
      this.editMode = false;
      this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
      this.store.dispatch(new ShoppingListActions.DeleteIngredients())
      this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
