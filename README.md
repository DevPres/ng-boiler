# NgBoiler

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.3.

This is a boilerplate for an angular application without modules, and with a folder structure
that aim to replicate a file-system based router folder structure.

## From Modules To Standalone

- Remove app.modules

- Remove app-routing.module (if the CLI has generated it)


- Change app bootstrapping
   
   Instead of using platformBrowserDynamic() function to bootstrap the AppModule, we can use the new bootstrapApllication() function,
   that accept as first argument the entry component of our app (usually the AppComponent), and as second argument an object of type
   `ApplicationConfig` (see below) 

    ```ts
    bootstrapApplication(AppComponent, AppConfig) // See next step for the AppConfig structure
        .catch(err => console.error(err));
    ```


- Create app.config

   Here we can import providers that we usually import through app.module.
   For Example, if we have an external module, and we need to import it for our application, we can use importProvidersFrom() function:

   ```ts
   export const AppConfig: ApplicationConfig = {
        providers: [
            // ... other providers
            importProvidersFrom(Module),
        ],
    }
   ```

- Make App component with standalone flag
    
    We can simply add the standalone flag to the AppComponent and now we have our standalone app working!

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




    

