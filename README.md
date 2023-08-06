# NgBoiler

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.3.


## From Modules To Standalone

- Remove app.modules

- Remove app-routing.module (if the CLI has generated it)


- Change app bootstrapping
   
    Instead of using the platformBrowserDynamic() function in `main.ts` file to bootstrap the AppModule, 
    we can use the new bootstrapApplication() function from `@angular/platform-browser`. 
    This function takes the entry component of our app (The root component passed into this function must be a standalone one) as the first argument and an object
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
        selector: 'ngb-root',
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

    Before continuing: 

    The folder structure presented here aims to replicate the structure of a file-based routing system used in other frameworks. The structure is organized as follows: 

    This is an opinionated way to organize the application. I litteraly stolen the idea from [this repo](https://github.com/juanmesa2097/angular-boilerplate) 

    ```tree
    .
    └── pages/
        ├── home/
        │   ├── home.component
        │   └── index.ts
        └── user/
            ├── user.component
            ├── index.ts
            └── foo/
                ├── foo.component
                └── index.ts
    ```
    
    In the `index.ts` file we will configure and export our routes as:

    ```ts
    export const routes: Routes = [
        { 
            path: '', 
            title: 'home', 
            loadComponent: 
                () => import('@pages/home/home.component').then(m => m.HomeComponent)
        },
    ];
    ```

    Now let's create a dynamic HomeComponent!

    First of all we can use an angular `schematics` to generate our components, so from the root of our project
    in the terminal we can launch this command:
    
    ```bash
    $ ng g c pages/home

    CREATE src/app/pages/home/home.component.css (0 bytes)
    CREATE src/app/pages/home/home.component.html (19 bytes)
    CREATE src/app/pages/home/home.component.spec.ts (540 bytes)
    CREATE src/app/pages/home/home.component.ts (365 bytes)
    ```

    Now that we have our components ready, we need to instruct Angular to load our component when the endpoint /home is accessed.

    To achieve this, we first create an index.ts file inside the home folder. This file will serve as an entry point for the home module and will help us load the components correctly.
    
    ```ts
    // /home/index.ts
    export const routes: Routes = [
        { 
            path: '', 
            title: 'home', 
            loadComponent: 
                () => import('@pages/home/home.component').then(m => m.HomeComponent)
        }
    ];
    ```
    To be able to load the pages from `pages` folder using `@pages/` path instead of absolute path, we have to add the alias in `tsconfig.json`:

    ```json
    {
        ...
        "compilerOptions": {
            "paths": {
                "@pages/*": ["src/app/pages/*"],
            } 
        }
    }
    ```

    Now, we can go to the app.routes file and configure Angular to load our home routes when the /home endpoint is accessed.

    ```ts
    // /app/app.routes.ts
    export const routes: Routes = [
        { 
            path: 'home',
                loadChildren: () => import('@pages/home/').then(m => m.routes)  
        },
        { 
            path: '', 
            redirectTo: 'home',
            pathMatch: 'full' 
        },
    ]
    ```

    The second route configuration specifies the default route when the application is accessed at the root URL (/).
    In this case, it redirects to the home route.

    Now we have to instruct Angular where load the component.
    To achieve this, we can use the component `<router-outlet>` provided by the `RouterModule` in our `AppComponent`:

    ```ts
    @Component({
        selector: 'ngb-root',
        standalone: true,
        imports: [RouterModule],
        template: `<router-outlet></router-outlet>`,
    })
    ```
    
    And now, the routing is working! 
    
- Catching unknown routes

    To enhance the robustness of our routing, we can incorporate a straightforward handler for unknown routes
    To achieve this, we can start by creating a '404.component' in our 'pages' folder.

    ```ts
    // pages/404.components
    @Component({
        selector: 'ngb-root',
        standalone: true,
        imports: [RouterModule],
        template: `<router-outlet></router-outlet>`,
    })
    ```

