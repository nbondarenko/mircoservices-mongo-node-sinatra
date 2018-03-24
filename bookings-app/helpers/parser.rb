class Parser

  def self.json(data)

    return {} if data == ""

    begin
      return JSON.parse(data, symbolize_names: true)
    rescue Exception => e
      raise ParseError, "Invalid JSON"
    end

  end

  private

  class ParseError < RuntimeError
  end

end