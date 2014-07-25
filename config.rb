# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path       = "/app/public"
css_dir         = "/app/public/scss/"
sass_dir        = "/app/public/scss-src/"
images_dir      = "/app/public/img"
javascripts_dir = "/app/public/js"

# You can select your preferred output style here (can be overridden via the command line): :expanded or :nested or :compact or :compressed
output_style = (environment == :production) ? :compressed : :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = (environment == :production) ? false : true


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

# Compact function pulled from compass
module Sass::Script::Functions
  module CustomSassExtensions
    def concatinate(*args)
      if args && args.length then
        return args.join("");
      else
        return "";
      end

    end
  end
  include CustomSassExtensions
end