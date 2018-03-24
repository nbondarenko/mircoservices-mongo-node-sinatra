$LOAD_PATH << File.join(File.dirname(__FILE__))

require 'rubygems'
require 'bundler'
Bundler.require(:default)
require './app'

run Sinatra::Application