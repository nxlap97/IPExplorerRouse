using Serilog;
using System;
using System.Collections.Generic;
using Umbraco.Forms.Core;
using Umbraco.Forms.Core.Data.Storage;
using Umbraco.Forms.Core.Enums;
using Umbraco.Forms.Core.Persistence.Dtos;
using Umbraco.Core.Logging;
using Umbraco.Core.Composing;

namespace PrereleaseForm8_4.Workflows
{
    /// <summary>
    /// Summary description for TestWorkflow
    /// </summary>
    public class TestWorkflow : WorkflowType
    {


        public TestWorkflow()
        {
            this.Id = new Guid("05078743-8f73-417a-a62e-e9c3e1cee441");
            this.Name = "TestWorkflow";
            this.Description = "This workflow is just for testing";
            this.Icon = "icon-chat-active";
            this.Group = "Services";
        }
        public override WorkflowExecutionStatus Execute(Record record, RecordEventArgs e)
        {
            // first we log it
            Current.Logger.Debug<TestWorkflow>("the IP " + record.IP + " has submitted a record");

            // we can then iterate through the fields
            foreach (RecordField rf in record.RecordFields.Values)
            {
                // and we can then do something with the collection of values on each field
                List<object> vals = rf.Values;

                // or get it as a string
                rf.ValuesAsString();
            }

            //Change the state
            record.State = FormState.Approved;

            Current.Logger.Debug<TestWorkflow>("The record with unique id {RecordId} that was submitted via the Form {FormName} with id {FormId} has been changed to {RecordState} state",
               record.UniqueId, e.Form.Name, e.Form.Id, "approved");

            return WorkflowExecutionStatus.Completed;
        }

        public override List<Exception> ValidateSettings()
        {
            return new List<Exception>();
        }

    }
}