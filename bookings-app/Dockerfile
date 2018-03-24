FROM ruby:latest
WORKDIR /usr/src/app
COPY Gemfile ./
RUN bundle install --quiet
COPY . .
EXPOSE 5001
CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "-p", "5001"]