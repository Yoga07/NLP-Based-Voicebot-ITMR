import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEBase import MIMEBase
from email import encoders
import os
import pymongo
import pprint
import json
from json2table import convert
import pdfkit

'''
Connecting MongoDb and getting values stored in the Database
'''


def read():
    try:
	    client=pymongo.MongoClient('localhost',27017)   #Db connect
	    db=client.dbx
	    empCol = db.formx.find()
	    for emp in empCol:
		   temp=emp
	    build_direction = "LEFT_TO_RIGHT"
	    table_attributes = {"style" : "width:100%"}
	    html = convert(emp, build_direction=build_direction, table_attributes=table_attributes)
	    file = open('testfile.html', 'w')
	    file.write(html)
	    file.close()
	    pdfkit.from_file('testfile.html', 'application.pdf')

    except Exception, e:
        print str(e)
    
    print("CONVERTED TO PDF")


def mailit():
	read()
	fromaddr = "itmr2k17@gmail.com"
	toaddr = "sunny.napa@gmail.com"
	 
	msg = MIMEMultipart()
	 
	msg['From'] = fromaddr
	msg['To'] = toaddr
	msg['Subject'] = "Loan Details"
	 
	body = "PFA"
	 
	msg.attach(MIMEText(body, 'plain'))
	 
	filename = "application.pdf"
	attachment = open("/home/santhosh/Documents/Project/ITMR/Botkit/pyscripts/application.pdf", "rb")
	 
	part = MIMEBase('application', 'octet-stream')
	part.set_payload((attachment).read())
	encoders.encode_base64(part)
	part.add_header('Content-Disposition', "attachment; filename= %s" % filename)
	 
	msg.attach(part)
	 
	server = smtplib.SMTP('smtp.gmail.com', 587)
	server.starttls()
	server.login(fromaddr, "itmr*2k17")
	text = msg.as_string()
	server.sendmail(fromaddr, toaddr, text)
	server.quit()
	
	print('DONE')

def main():
    mailit() 

if __name__ == '__main__':
    main()
