class StaticPagesController < ApplicationController
  respond_to :js, :json, :html

  def home
  end

  def entercities
    @id = params[:id].to_i
    redirect_to(root_path) if(@id > 15.to_i || @id < 0)
    flash.now[:success] = "Please Enter #{@id} cities"

  end

  def yourtrip
    flash.now[:success] = params[:passval]

  end

  def help
  end

  def about
  end

  def contact
  end

end
