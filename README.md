# NgBoiler

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.3.


## From Modules To Standalone

- Remove app.modules

- Remove app-routing.module (if the CLI has generated it)


- Change app bootstrapping
   
    Instead of using the platformBrowserDynamic() function in `main.ts` file to bootstrap the AppModule, 
    we can use the new bootstrapApplication() function from `@angular/platform-browser`. 
    This function takes the entry component (The root component passed into this function must be a standalone one) of our app (usually the AppComponent) as the first argument and an object
    of type `ApplicationConfig` as the second argument (see next step):

    ```ts
    import { AppComponent } from './app/app.component';
    import { ApplicationConfig, bootstrapApplication } from '@angular/platform-browser';

    const AppConfig: ApplicationConfig = {
        providers: [
            //Here, we can import providers that we usually include in the `app.module`.
        ],
    };


    bootstrapApplication(AppComponent, AppConfig) // See next step for the AppConfig structure
        .catch(err => console.error(err));
    ```
    
    Later, in the `AppConfig`, we can load all the providers that we need at the root level.

- Make App component standalone 
    
    We can easily create the standalone AppComponent by adding the 'standalone' flag to it.

    ```ts
    @Component({
        selector: 'app-root',
        standalone:true,
        template: `
            <div>
              <h1> Test {{ title }} </h1>
            </div>
          `,
        styleUrls: ['./app.component.css']
        ....

    ```


- Modify angular.json

    To complete our standalone configuration we have to enable the standalone flag in our angular.json, so everytime we add new component, it came with standalone standalone flag set to true

    ```json
        "projects": {
            ...
            "schematics": {
                ...
                "@schematics/angular:component": {
                    "standalone": true,
                }
                ...
    ```
    
    This project enable  the changeDetection OnPush flag, that add the [OnPush Detection](https://angular.io/guide/change-detection-skipping-subtrees#using-onpush) . 
    This is not mandatory for a standalone app, but is a huge and simply performance improvement
    

    ```json
    "projects": {
        ...
        "schematics": {
            ...
            "@schematics/angular:component": {
                "standalone": true,
                "changeDetection": "OnPush"
            }
            ...
    ```

Now we have an Angular standalone App, but we miss an important things here : Routing.

In the next steps we will implementing it, using a not classical folder structure for an angular application.

## Routing

The routing structure that we are going to implement is strongly inspired by [this repository](https://github.com/juanmesa2097/angular-boilerplate).

- Create app.routes file

    First of all, we have to create our entry file for routes. So create the app.routes file, e create the routes variable:

    ```ts
    export const routes: Routes = [];
    ```

    Then, in our application configuration, in the `main.ts` file, we have to import the routing provider using `provideRouter()`. It takes an array of routes as its first argument, which will be our first-level routes.

    ```ts
    ...
    import { routes } from './app/app.routes';
    import { provideRouter, withComponentInputBinding } from '@angular/router';

    const AppConfig: ApplicationConfig = {
        providers: [
            provideRouter(routes, withComponentInputBinding()),
        ],
    };
    ```

    The `withComponentInputBinding()` is a new Angular function that enables the binding between the route params and component inputs. 
    With this approach, Angular automatically serves the URL params as inputs to our component, allowing us to avoid all the work we previously did with `activatedRoute`.

    Before: 

    ```ts
    const routes: Routes = [
        {
            path: "user/:id",
            ...
        },
    ];

    ...
    Class UserComponent {
        private route = inject(ActivatedRoute);

        id$ = this.route.params.pipe(map((params) => params['id']));
    }
    ```

    Now: 

    ```ts
    const routes: Routes = [
        {
            path: "user/:id",
            ...
        },
    ];

    ...
    Class UserComponent {
        @Input() id?: string
    }
    ```
    When we insert some components into our application, we will get to experience all the new features that Angular has implemented for inputs!

- Create first route

    Before create the new route for our application, we have to create 


