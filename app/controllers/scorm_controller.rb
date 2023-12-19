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
  
    def setSCOesOData(name, value, objGivenSCO)
      scoesdata = []
      scoesdata.elementname = name
      scoesdata.elementvalue = value
      objGivenSCO.scoes_data.push(scoesdata)
      return objGivenSCO
    end
  
    def setSCOesData(name, objGivenNode, objGivenSCO)
      scoesdata = []
      scoesdata.elementname = name
      if (objGivenNode.attributes[name] != undefined) 
          scoesdata.elementvalue = objGivenNode.attributes[name]
          objGivenSCO.scoes_data.push(scoesdata)
      end
  
      return objGivenSCO
    end
  
    def index
      
      file = "./Test.zip"
  
      #def extract_zip(file, destination)    
      #puts Dir.pwd
      
      upload_path = "public/upload"
      Dir.mkdir(upload_path)  unless File.exist?(upload_path)
        
      random_dir = SecureRandom.hex
      dest_dir = upload_path + "/" + random_dir
      Dir.mkdir(dest_dir) 
  
      #FileUtils.mkdir_p(dest_dir)
  
      Zip::File.open(file) do |zip_file|
        zip_file.each do |f|
          fpath = File.join(dest_dir, f.name)
          zip_file.extract(f, fpath) unless File.exist?(fpath)
        end
      end
      #end  
      
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
      parsed_info = Nokogiri::XML(File.open(dest_dir + "/imsmanifest.xml"))  
      root = XMLObject.new(File.open(dest_dir + "/imsmanifest.xml"))  
  
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
  
  
      # @m_resourcesList.each_with_index do |resource, index|
      #   puts index
      # end
  
      reader = Nokogiri::XML::Reader(parsed_info.to_xml)
      reader.read 
      reader.each do |node|
        case node.name
        when "manifest"
            if node.attribute("xmlns") == m_sXmlns12 || node.attribute("xmlns") == m_sXmlns2004
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
        when "title"
          if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT              
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
            scormscoes.push(ScoesService.new m_manifest, m_parentOrg, m_parentIdentifier, identifier, launchFile, scormtype, title)
            @m_scoesList.push(scormscoes)
          end      
        when "adlcp:maxtimeallowed"
          if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
            #node.inner_xml
          end
        when "adlcp:datafromlms"
          if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
            #node.inner_xml
          end        
        when "adlcp:masteryscore"
          if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
            #node.inner_xml
          end           
        when "adlcp:timelimitaction"
          if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
            #node.inner_xml
          end
        when "adlcp:completionthreshold"        
          if node.node_type == Nokogiri::XML::Reader::TYPE_ELEMENT
            #node.inner_xml
          end                
        when "adlnav:presentation"      
        end
      end
  
      @m_scoesList.each_with_index do |scoes, index|
        scoes.each do |sco|
          puts sco.manifest
          puts sco.organization
          puts sco.parent
          puts sco.identifier
          puts sco.launch
          puts sco.scormtype
          puts sco.title
        end
      end
    end
  end
  