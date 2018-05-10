Dotenv.load
require './mongoid.rb'
Dir['./helpers/*.rb'].each { |file| require file }

before do
  # Set response type
  content_type :json

  # CORS
  response.headers["Access-Control-Allow-Origin"] = "*"
end

def booking_params(params)
  puts(params)
  begin
    @params = Parser.json(request.body.read)
  rescue Exception => e
    halt 400, puts("custom: #{e}")
  end
  puts(@params)
  @params = @params.slice(:amount, :bike_id)
  puts(@params)
  halt 422, { error: 'Invalid params' }.to_json if @params.count < 2
  @params
end

get '/' do
  'Hello world!'
end

get '/bookings' do
   'hi'
end

post '/bookings' do
  @booking = Booking.new(booking_params(params))
  @booking.save

  @booking.to_json
end

get '/bookings/:id' do
  @booking = Booking.find(params[:id])
  @booking.to_json
end

put '/bookings/:id' do
  @booking = Booking.find(params[:id])
  @booking.update(booking_params(params))

  @booking.to_json
end

delete '/bookings/:id' do
  Booking.find(params[:id]).delete
  status 200
  body ''
end