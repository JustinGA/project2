Whoa::Application.routes.draw do
 
  root 'welcome#index'


  resources :questions
  
  resources :users

  resource :session

<<<<<<< HEAD

=======
>>>>>>> 8abaa4a85824b230af8e41d939136551a353b770
  resource :welcome, only: [:index]

end