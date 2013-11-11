class StudentsController < ApplicationController
end

def index 
  @student = Student.new
    render :index
end

