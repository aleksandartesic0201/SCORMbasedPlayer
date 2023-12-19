class ScoesService
  attr_accessor :manifest, :organization, :parent, :identifier, :launch, :scormtype, :title

  def initialize(manifest, organization, parent, identifier, launch, scormtype, title)
      @manifest = manifest
      @organization = organization
      @parent = parent
      @identifier = identifier
      @launch = launch      
      @scormtype = scormtype
      @title = title
  end
end

class ResourceService
  attr_accessor :launch, :identifier, :scormtype

  def initialize(launch, identifier, scormtype)
      @launch = launch
      @identifier = identifier
      @scormtype = scormtype      
  end
end

class HomepageController < ApplicationController

  require 'zip'
  require 'nokogiri'
  require 'rexml/document'
  require 'xmlmapper/anonymous_mapper'
  require 'securerandom'


  def index
    
    # file = "./SCORM 1.2 test.zip"

    # #def extract_zip(file, destination)    
    # #puts Dir.pwd
    
    # upload_path = "public/uploads"
    # Dir.mkdir(upload_path)  unless File.exist?(upload_path)
      
    # random_dir = SecureRandom.hex
    # dest_dir = upload_path + "/" + random_dir
    # Dir.mkdir(dest_dir) 

    # Zip::File.open(file) do |zip_file|
    #   zip_file.each do |f|
    #     fpath = File.join(dest_dir, f.name)
    #     FileUtils.mkdir_p(File.dirname(fpath))
    #     zip_file.extract(f, fpath) unless File.exist?(fpath)
    #   end
    # end
    #end 
  end
end
