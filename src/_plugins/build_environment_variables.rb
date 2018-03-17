module Jekyll
  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      site.config['env'] = {}
      site.config['env'] = site.config['env'].merge(ENV || {})
    end

  end
end
