require 'mongoid'

Mongoid.load!('config/mongoid.yml')

class Booking
  include Mongoid::Document
  include Mongoid::Timestamps

  field :amount, type: Integer
  field :bike_id, type: String
end
