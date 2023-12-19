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


class Api::V1::ScormController < ApplicationController

  require 'zip'
  require 'nokogiri'
  require 'rexml/document'
  require 'xmlmapper/anonymous_mapper'
  require 'securerandom'

  #skip_before_action :verify_authenticity_token, except: [:index]
  skip_before_action :verify_authenticity_token
  
    def index
        @courses = Scorm.all
        render json: @courses
    end

    def getTrack
      @scormid = params[:id]
      #@sco = params[:sco]
      #@vs = params[:vs]
      jsonData = "{"
      objTrack = ScormScoTrack.where(scorm: @scormid, sco:1)
      scoes = ScormSco::where(scorm: @scormid).where.not(launch: "")
      sco = scoes[0].id
      user = 1
      scorm = Scorm::find(@scormid)

      jsonData += '"version":"SCORM1.2",'
      jsonData += '"cmi_core_student_id":"student",'
      jsonData += '"cmi_core_student_name":"student",'
      jsonData += '"cmi_core_lesson_status":"student",'
      jsonData += '"cmi_core_lesson_location":"student",'
      jsonData += '"cmi_core_score.raw":"student",'
      jsonData += '"cmi_core_score.max":"student",'
      jsonData += '"cmi_core_session_time":"student",'
      jsonData += '"cmi_core_total_time":"student",'
      jsonData += '"cmi_core_exit":"student",'
      jsonData += '"cmi_suspend_data":"student",'
      jsonData += '"user": "' + user.to_s + '",'
      jsonData += '"sco": "' + sco.to_s + '",'
      jsonData += '"scorm": "' + @scormid.to_s + '",'
      jsonData += '"launch": "' + scoes[0].launch + '"'
      jsonData += '}';
      return render json: {success: true, status: 200, data: jsonData}
    end

    def setTrack

    end
      # post '/course package'
    def upload  
        begin
          m_scormversion = ""
          m_sXmlns2004 = "http://www.imsglobal.org/xsd/imscp_v1p1";
          m_sXmlns12 = "http://www.imsproject.org/xsd/imscp_rootv1p1p2";
          m_manifest = ""
          m_defaultOrg = ""
          m_parentIdentifier = ""
          m_parentOrg = ""
          m_organization = ""
          @m_scoesList = []
          @m_resourcesList = []

          upload_path = "public/uploads"
          Dir.mkdir(upload_path)  unless File.exist?(upload_path)          
          random_dir = SecureRandom.hex
          dest_dir = upload_path + "/" + random_dir
          Dir.mkdir(dest_dir) 

          uploaded_io = params[:file]

          File.open(Rails.root.join(dest_dir, uploaded_io.original_filename), 'wb') do |file|
            file.write(uploaded_io.read)
          end
          
          package = dest_dir + "/" + uploaded_io.original_filename

          if File.exist?(package)
            Zip::File.open(package) do |zip_file|
              zip_file.each do |f|
                fpath = File.join(dest_dir, f.name)
                FileUtils.mkdir_p(File.dirname(fpath))
                zip_file.extract(f, fpath) unless File.exist?(fpath)                
              end
            end
            if File.exist?(dest_dir + "/" + "imsmanifest.xml")
  
            end
            if File.exist?(dest_dir + "/" + "imsmanifest.xml")
              parsed_info = Nokogiri::XML(File.open(dest_dir + "/imsmanifest.xml"))  

              resourceReader = Nokogiri::XML::Reader(parsed_info.to_xml)
              resourceReader.read #Moves to next node in document                
              
              resourceReader.each do |node|
                case node.name
                when "resource"
                  if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
                    
                    launch = node.attribute("href")
                    identifier = node.attribute("identifier")
                    scormtype = node.attribute("adlcp:scormtype")
          
                    scoreresources = []
                    scoreresources.push(ResourceService.new launch, identifier, scormtype)
                    
                    @m_resourcesList.push(scoreresources)
                    
                  end
                end
              end

              manifestReader = Nokogiri::XML::Reader(parsed_info.to_xml)
              manifestReader.read 
              manifestReader.each do |node|
                case node.name
                when "manifest"
                    if node.attribute("xmlns") == m_sXmlns12
                      m_manifest = node.attribute("identifier")
                    end
                when "metadata"
                  if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
                    manifest = XMLObject.new(File.open(dest_dir + "/imsmanifest.xml"))
                    m_scormversion = manifest.metadata.schemaversion
                  end  
                when "organizations"
                  if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
                    m_defaultOrg = node.attribute("default")
                  end
                when "organization" 
                  if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
                    title = ""
                    orgIdentifier = node.attribute("identifier")
                    node.each do |child| #file element
                      if child.name == "title"
                        title = child.inner_xml
                        break
                      end
                    end 
                    scormscoes = []          
                    scormscoes.push(ScoesService.new m_manifest, "", "/", orgIdentifier, "", "", title)
          
                    @m_scoesList.push(scormscoes) 
          
                    m_parentIdentifier = orgIdentifier
                    m_parentOrg = m_organization
                    m_organization = orgIdentifier       
                  end
                when "item"
                  if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
                    title = ""
                    launchFile = "";
                    scormtype = 'asset';          
                    identifier = node.attribute("identifier")
                    identifierref = node.attribute("identifierref")
                    #node.attribute("isvisible")
                    if node.attribute("identifierref") != ""
                      @m_resourcesList.each_with_index do |resource, index|
                        if resource[index].identifier == identifierref
                          launchFile = resource[index].launch
                          if resource[index].scormtype == ""
                            scormtype = "asset"
                          else
                            scormtype = resource[index].scormtype
                          end
                        end
                      end
                    end
                    node.each do |child| #file element
                      if child.name == "title"
                        title = child.inner_xml
                        break
                      end
                    end 
                    scormscoes = []
                    m_parentOrg = m_parentIdentifier
                    scormscoes.push(ScoesService.new m_manifest, m_parentOrg, m_parentIdentifier, identifier, launchFile, scormtype, title)
                    @m_scoesList.push(scormscoes)
                  end 
                end
              end

              data = {
                title: File.basename(uploaded_io.original_filename),
                reference: uploaded_io.original_filename,
                version: m_scormversion,
                targetid: dest_dir
              }
              scorm = Scorm.new(data)
              scorm.save()
              scormid = scorm.id
              @m_scoesList.each_with_index do |scoes, index|
                scoes.each do |sco|
                  data = {
                    scorm: scormid,
                    manifest: m_manifest,
                    organization: sco.organization,
                    parent: sco.parent,
                    identifier: sco.identifier,
                    launch: sco.launch,
                    scormtype: sco.scormtype,
                    title: sco.title
                  }
                  scorm_scoes = ScormSco.new(data)
                  scorm_scoes.save()

                end
              end            
            else
               
            end
          end


          return render json: {success: true, status: 200}
        rescue => exception
          #  TODO: Log error
          puts exception
          return render json: {success: false, status: 422, error: exception.message}
        end
    end
end