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
      # get '/course/list'
    def index
        @courses = Scorm.all
        render json: @courses
    end
      # get 'course/delcourse'
    def deleteCourse
        @scormid = params[:id]
        Scorm::find(@scormid).delete
    end
      # get '/course/getsco'
    def getSCO
      @scormid = params[:id]
      scoes = ScormSco::where(scorm: @scormid).where.not(launch: "")
      scorm = Scorm::find(@scormid)
      sco = scoes[0].id
      target = scorm.targetid
      launch = target + "/" + scoes[0].launch

      return render json: {success: true, status: 200, sco: sco, launch: launch}
    end
      # get '/course/getstatus'
    def getStatus
      @scormid = params[:id]
      @userid = params[:user]
      report = ScormReport::where(scorm: @scormid, user: @userid)
      
      status = report[0].completed_status
      score = report[0].total_score
      time = report[0].total_time

      return render json: {success: true, status: 200, status: status, score: score, time: time}
    end
    def getElementValue(scorm, sco, user, elementname)
      trackData = ScormScoTrack.where(scorm: scorm, sco: sco, user: user, elementname: elementname)
      value = ""
      if !trackData.empty?
        value = trackData[0].elementvalue
      end
      return value
    end
      # get '/course/gtrack'
    def getTrack
      @scormid = params[:id]
      @sco = params[:sco]
      @vs = params[:vs]
      @user = params[:user]
      jsonData = "{"
      
      scoes = ScormSco::where(scorm: @scormid).where.not(launch: "")
      sco = scoes[0].id
      user = 1
      scorm = Scorm::find(@scormid)

      jsonData += '"version":"SCORM1.2",'
      jsonData += '"cmi_core_student_id":"' + getElementValue(@scormid, @sco, @user, "cmi.core.student_id") + '",'
      jsonData += '"cmi_core_student_name":"' + getElementValue(@scormid, @sco, @user, "cmi.core.student_name") + '",'
      jsonData += '"cmi_core_lesson_status":"' + getElementValue(@scormid, @sco, @user, "cmi.core.lesson_status") + '",'
      jsonData += '"cmi_core_lesson_location":"' + getElementValue(@scormid, @sco, @user, "cmi.core.lesson_location") + '",'
      jsonData += '"cmi_core_score_raw":"' + getElementValue(@scormid, @sco, @user, "cmi.core.score.raw") + '",'
      jsonData += '"cmi_core_score_max":"' + getElementValue(@scormid, @sco, @user, "cmi.core.score.max") + '",'
      jsonData += '"cmi_core_total_time":"' + getElementValue(@scormid, @sco, @user, "cmi.core.total_time") + '",'
      jsonData += '"cmi_core_exit":"' + getElementValue(@scormid, @sco, @user, "cmi.core.exit") + '",'
      jsonData += '"cmi_suspend_data":"' + getElementValue(@scormid, @sco, @user, "cmi.suspend_data") + '",'
      jsonData += '"user": "' + user.to_s + '",'
      jsonData += '"sco": "' + sco.to_s + '",'
      jsonData += '"scorm": "' + @scormid.to_s + '",'
      jsonData += '"launch": "' + scoes[0].launch + '"'
      jsonData += '}';
      return render json: {success: true, status: 200, data: jsonData}
    end
      # post '/course/strack'
    def setTrack
      @sco = params[:sco]
      @scorm = params[:scorm]
      @user = params[:user]
      
      @total_score = 0;            
      @completed_status = "Unknown";
      @total_time = "00:00:00";

      params.each do |key, value|
          if key != "version" and key != "user" and key != "sco" and key != "scorm" and key != "launch" and key != "controller" and key != "action"    
          key = key.gsub("__", ".")

          case key
          when "cmi.core.lesson_status"
            @completed_status =  value
          when "cmi.core.score.raw"
            @total_score = value
          when "cmi.core.total_time"
            @total_time = value            
          end 

          data = {
            scorm: @scorm,
            sco: @sco,
            user: @user,
            elementname: key,
            elementvalue: value
          }

          trackData = ScormScoTrack.where(scorm: @scorm, sco: @sco, user: @user, elementname: key)

          if trackData.empty?
            track = ScormScoTrack.new(data)
            track.save()         
          else
            track = ScormScoTrack.find(trackData[0].id).update_columns(elementvalue: value)
          end
         end              
      end
            
      reportData = ScormReport.where(scorm: @scorm, user: @user)

      report = {
            scorm: @scorm,
            user: @user,
            completed_status: @completed_status,
            total_score: @total_score,
            total_time: @total_time
      }

      if reportData.empty?
        report = ScormReport.new(report)
        report.save()         
      else
        report = ScormReport.where(:id => reportData[0].id).update_all({:completed_status => @completed_status, :total_score => @total_score, :total_time => @total_time})
      end
    end
      # post '/course/upload'
    def upload  
        begin
          m_scormversion = ""
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
                title: File.basename(uploaded_io.original_filename, ".zip"),
                reference: uploaded_io.original_filename,
                version: m_scormversion,
                targetid: random_dir
              }
              if !m_manifest.empty?
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
              end       
            else
               return render json: {success: false, status: 500}
            end
          end
          return render json: {success: true, status: 200}
        rescue => exception
          #  TODO: Log error
          return render json: {success: false, status: 422, error: exception.message}
        end
    end
end