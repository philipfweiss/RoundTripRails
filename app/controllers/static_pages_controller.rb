class StaticPagesController < ApplicationController
  def home
  end

  def entercities
    @id = params[:id].to_i
    @user = User.new
    redirect_to(root_path) if(@id > 15.to_i || @id < 0)
    flash.now[:success] = "Please Enter #{@id} cities"

  end

  def help
  end

  def about
  end

  def contact
  end

end
