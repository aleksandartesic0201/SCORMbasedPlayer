Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Routes index route to React app root in `view/homepage/index.html.erb`
  root "homepage#index"

  # API Routes

  # Users
  # TODO: Generate a new controller for users w/o the api/v1 since you don't really need this -- then move exisitng methods over and update the callsites below
  # get '/api/v1/users', to: 'api/v1/user#index'
  post '/user/register', to: 'api/v1/user#create'
  post '/user/login', to: 'api/v1/user#login'
  get '/user/logout', to: 'api/v1/user#logout'

  get '/course/list', to: 'api/v1/scorm#index'
  get '/course/gtrack', to: 'api/v1/scorm#getTrack'
  get '/course/getsco', to: 'api/v1/scorm#getSCO'
  get '/course/delcourse', to: 'api/v1/scorm#deleteCourse'
  get '/course/getstatus', to: 'api/v1/scorm#getStatus'
  post '/course/upload', to: 'api/v1/scorm#upload'
  post '/course/strack', to: 'api/v1/scorm#setTrack'
  #get '/course/getlaunch', to: 'api/v1/scorm#getLaunchFile'
  #get '/course/launch', to: 'api/v1/scorm#launch'
  # Redirect all other routes back to front-end React application
  # If we don't do this, refreshing the page will break as Rails will not know
  # how to redirect back to React SPA.
  get '*path', to: "homepage#index", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
