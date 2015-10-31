module Jekyll
  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      site.config['circle_sha'] = ENV['CIRCLE_SHA']
      site.config['circle_build_number'] = ENV['CIRCLE_BUILD_NUM']
    end

  end
end
